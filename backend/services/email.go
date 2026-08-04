package services

import (
	"bytes"
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/domain"
	"github.com/kadusic1/seguras/backend/util"
	"github.com/wneessen/go-mail"
)

type EmailPayload struct {
	To                    string
	Subject               string
	Body                  string
	AttachmentFilename    string
	AttachmentData        []byte
	AttachmentContentType string
}

type EmailService struct {
	cfg config.SMTPConfig
}

func NewEmailService() (*EmailService, error) {
	cfg, err := config.LoadSMTP()
	if err != nil {
		return nil, err
	}
	return &EmailService{cfg: *cfg}, nil
}

func (s *EmailService) Send(payload EmailPayload) error {
	return s.send(payload)
}

func (s *EmailService) SendAsync(payload EmailPayload) {
	go func() {
		if err := s.Send(payload); err != nil {
			log.Printf("email send failed: %v", err)
		}
	}()
}

func (s *EmailService) SendJobApplicationNotification(
	app *domain.JobApplication,
	cvFilename string,
	cvData []byte,
	cvContentType string,
) error {
	return s.Send(EmailPayload{
		To:                    s.cfg.NotificationEmail,
		Subject:               "New Job Application",
		Body:                  s.buildJobNotificationBody(app),
		AttachmentFilename:    cvFilename,
		AttachmentData:        cvData,
		AttachmentContentType: cvContentType,
	})
}

func (s *EmailService) SendContactNotification(msg *domain.ContactMessage) {
	s.SendAsync(EmailPayload{
		To:      s.cfg.NotificationEmail,
		Subject: "New Contact Message",
		Body:    s.buildContactNotificationBody(msg),
	})
}

func (s *EmailService) send(payload EmailPayload) error {
	port, err := strconv.Atoi(s.cfg.Port)
	if err != nil {
		return fmt.Errorf("invalid SMTP port %q: %w", s.cfg.Port, err)
	}

	m := mail.NewMsg()
	if err := m.From(s.cfg.FromEmail); err != nil {
		return fmt.Errorf("set from: %w", err)
	}
	if err := m.To(payload.To); err != nil {
		return fmt.Errorf("set to: %w", err)
	}
	m.Subject(payload.Subject)
	m.SetBodyString(mail.TypeTextHTML, payload.Body)

	if len(payload.AttachmentData) > 0 {
		m.AttachReadSeeker(
			payload.AttachmentFilename,
			bytes.NewReader(payload.AttachmentData),
			mail.WithFileContentType(mail.ContentType(payload.AttachmentContentType)),
		)
	}

	c, err := mail.NewClient(s.cfg.Host,
		mail.WithPort(port),
		mail.WithUsername(s.cfg.Username),
		mail.WithPassword(s.cfg.Password),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
	)
	if err != nil {
		return fmt.Errorf("mail client: %w", err)
	}

	if err := c.DialAndSend(m); err != nil {
		return fmt.Errorf("smtp send: %w", err)
	}

	log.Printf("email sent to %s: %s", payload.To, payload.Subject)
	return nil
}

func (s *EmailService) buildJobNotificationBody(app *domain.JobApplication) string {
	rows := strings.Join([]string{
		util.EmailRow("Name", fmt.Sprintf("%s %s", app.FirstName, app.LastName)),
		util.EmailRow("Date of Birth", util.FormatDate(app.DateOfBirth)),
		util.EmailRow("Address", app.Address),
		util.EmailRow("Email", app.Email),
		util.EmailRow("Phone", app.Phone),
		util.EmailRow("Hours Available", fmt.Sprintf("%d", app.HoursAvailable)),
		util.EmailRow("Clothing Size", string(app.ClothingSize)),
		util.EmailRow("Employment Type", string(app.EmploymentType)),
	}, "")

	return util.EmailShell(
		"New Job Application",
		"New Application",
		"A candidate has submitted an application through the Seguras careers form.",
		"This is an automated notification from the Seguras careers application system.",
		rows,
		"",
	)
}

func (s *EmailService) buildContactNotificationBody(msg *domain.ContactMessage) string {
	company := msg.Company
	if company == "" {
		company = "Not provided"
	}

	rows := strings.Join([]string{
		util.EmailRow("Name", fmt.Sprintf("%s %s", msg.FirstName, msg.LastName)),
		util.EmailRow("Email", msg.Email),
		util.EmailRow("Phone", msg.Phone),
		util.EmailRow("Company", company),
	}, "")

	messageBlock := fmt.Sprintf(`
            <tr>
              <td style="padding:8px 24px 24px;">
                <p style="margin:0 0 8px 0;color:#a1a1aa;font-size:13px;
                          font-weight:600;letter-spacing:.03em;
                          text-transform:uppercase;">Message</p>
                <p style="margin:0;color:#ffffff;font-size:15px;line-height:1.5;
                          white-space:pre-wrap;">%s</p>
              </td>
            </tr>`, msg.Message)

	return util.EmailShell(
		"New Contact Message",
		"New Message",
		"A visitor has submitted a message through the Seguras contact form.",
		"This is an automated notification from the Seguras contact form system.",
		rows,
		messageBlock,
	)
}