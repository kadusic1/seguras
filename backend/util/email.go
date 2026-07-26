package util

import (
	"bytes"
	"fmt"
	"log"
	"strconv"

	"github.com/kadusic1/seguras/backend/config"
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

type AsyncSender struct {
	cfg config.SMTPConfig
}

func NewAsyncSender() (*AsyncSender, error) {
	cfg, err := config.LoadSMTP()
	if err != nil {
		return nil, err
	}
	return &AsyncSender{cfg: *cfg}, nil
}

func (a *AsyncSender) Send(payload EmailPayload) {
	go func() {
		if err := send(a.cfg, payload); err != nil {
			log.Printf("email send failed: %v", err)
		}
	}()
}

func send(cfg config.SMTPConfig, payload EmailPayload) error {
	port, err := strconv.Atoi(cfg.Port)
	if err != nil {
		return fmt.Errorf("invalid SMTP port %q: %w", cfg.Port, err)
	}

	m := mail.NewMsg()
	if err := m.From(cfg.FromEmail); err != nil {
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

	c, err := mail.NewClient(cfg.Host,
		mail.WithPort(port),
		mail.WithUsername(cfg.Username),
		mail.WithPassword(cfg.Password),
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
