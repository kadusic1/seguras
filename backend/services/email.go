package services

import (
	"bytes"
	"fmt"
	"log"
	"strconv"

	"github.com/kadusic1/seguras/backend/config"
	"github.com/kadusic1/seguras/backend/domain"
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

func (s *EmailService) buildJobNotificationBody(app *domain.JobApplication) string {
	return fmt.Sprintf(`New Job Application
====================

Name:             %s %s
Date of Birth:    %s
BSN:              %s
Address:          %s
Email:            %s
Phone:            %s
Bank Account:     %s
Hours Available:  %d
Clothing Size:    %s
Employment Type:  %s`,
		app.FirstName, app.LastName, app.DateOfBirth, app.BSN,
		app.Address, app.Email, app.Phone, app.BankAccount,
		app.HoursAvailable, app.ClothingSize, app.EmploymentType)
}
