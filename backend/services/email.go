package services

import (
	"bytes"
	"fmt"
	"html"
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

func (s *EmailService) Send(payload EmailPayload) {
	go func() {
		if err := s.send(payload); err != nil {
			log.Printf("email send failed: %v", err)
		}
	}()
}

func (s *EmailService) SendJobApplicationNotification(
	app *domain.JobApplication,
	cvFilename string,
	cvData []byte,
	cvContentType string,
) {
	s.Send(EmailPayload{
		To:                    s.cfg.NotificationEmail,
		Subject:               "New Job Application",
		Body:                  s.buildJobNotificationBody(app),
		AttachmentFilename:    cvFilename,
		AttachmentData:        cvData,
		AttachmentContentType: cvContentType,
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

// emailRow renders a single label/value row in the notification table.
// Values are HTML-escaped since they come directly from user input.
func emailRow(label, value string) string {
	return fmt.Sprintf(`
        <tr>
          <td style="padding:12px 20px;border-bottom:1px solid #27272a;color:#a1a1aa;font-size:13px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;vertical-align:top;">%s</td>
          <td style="padding:12px 20px;border-bottom:1px solid #27272a;color:#ffffff;font-size:15px;font-weight:500;vertical-align:top;">%s</td>
        </tr>`, html.EscapeString(label), html.EscapeString(value))
}

func (s *EmailService) buildJobNotificationBody(app *domain.JobApplication) string {
	rows := strings.Join([]string{
		emailRow("Name", fmt.Sprintf("%s %s", app.FirstName, app.LastName)),
		emailRow("Date of Birth", util.FormatDate(app.DateOfBirth)),
		emailRow("BSN", app.BSN),
		emailRow("Address", app.Address),
		emailRow("Email", app.Email),
		emailRow("Phone", app.Phone),
		emailRow("Bank Account", app.BankAccount),
		emailRow("Hours Available", fmt.Sprintf("%d", app.HoursAvailable)),
		emailRow("Clothing Size", string(app.ClothingSize)),
		emailRow("Employment Type", string(app.EmploymentType)),
	}, "")

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Job Application</title>
  </head>
  <body style="margin:0;padding:0;background-color:#09090b;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#09090b;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%%;background-color:#000000;border:1px solid #27272a;border-radius:12px;overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="background-color:#000000;padding:28px 24px 20px 24px;border-bottom:2px solid #dc2626;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="font-size:24px;font-weight:900;font-style:italic;letter-spacing:.02em;color:#ffffff;">SEGURAS</span><br/>
                      <span style="font-size:12px;font-weight:700;letter-spacing:.08em;color:#a1a1aa;">SECURITY</span>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="display:inline-block;background-color:#dc2626;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:6px 12px;border-radius:999px;">New Application</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Intro -->
            <tr>
              <td style="padding:24px 24px 4px 24px;">
                <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">New Job Application</p>
                <p style="margin:6px 0 0 0;color:#a1a1aa;font-size:13px;">A candidate has submitted an application through the Seguras careers form.</p>
              </td>
            </tr>

            <!-- Details table -->
            <tr>
              <td style="padding:16px 24px 8px 24px;">
                <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border:1px solid #27272a;border-radius:8px;overflow:hidden;">
                  %s
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px;">
                <div style="height:1px;background-color:#27272a;margin-bottom:16px;"></div>
                <p style="margin:0;color:#71717a;font-size:12px;">This is an automated notification from the Seguras careers application system.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`, rows)
}
