package util

import "regexp"

var emailPattern = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

// ValidEmail checks if the string matches a basic email format.
func ValidEmail(email string) bool {
	return emailPattern.MatchString(email)
}

// ValidBSN checks if the input is a valid Dutch BSN using the elfproef
// (eleven-test). Accepts 8 or 9 digits with optional separators (spaces,
// dots, hyphens). 8-digit BSNs are internally padded with a leading zero
// before the checksum. The all-zero string is explicitly rejected.
func ValidBSN(bsn string) bool {
	d := make([]byte, 0, 9)
	for i := 0; i < len(bsn); i++ {
		b := bsn[i]
		if b >= '0' && b <= '9' {
			d = append(d, b-'0')
		} else if b != ' ' && b != '.' && b != '-' {
			return false
		}
	}
	if len(d) != 8 && len(d) != 9 {
		return false
	}
	if len(d) == 8 {
		d = append([]byte{0}, d...)
	}
	sum := 0
	for i := 0; i < 9; i++ {
		w := 9 - i
		if i == 8 {
			w = -1
		}
		sum += int(d[i]) * w
	}
	return sum%11 == 0 && sum != 0
}

// ValidDutchIBAN checks if the string is a structurally valid Dutch IBAN.
// After removing spaces, it must be exactly 18 characters: "NL" + 2 check
// digits + 4 bank-code letters + 10 account digits. The ISO 7064 MOD 97-10
// checksum confirms internal consistency.
func ValidDutchIBAN(iban string) bool {
	clean := make([]byte, 0, 18)
	for i := 0; i < len(iban); i++ {
		b := iban[i]
		if b == ' ' {
			continue
		}
		if b >= 'a' && b <= 'z' {
			b -= 32
		}
		clean = append(clean, b)
	}
	if len(clean) != 18 || clean[0] != 'N' || clean[1] != 'L' {
		return false
	}
	for i := 2; i < 4; i++ {
		if clean[i] < '0' || clean[i] > '9' {
			return false
		}
	}
	for i := 4; i < 8; i++ {
		if clean[i] < 'A' || clean[i] > 'Z' {
			return false
		}
	}
	for i := 8; i < 18; i++ {
		if clean[i] < '0' || clean[i] > '9' {
			return false
		}
	}
	rearranged := string(clean[4:]) + string(clean[:4])
	expanded := make([]byte, 0, len(rearranged)*2)
	for i := 0; i < len(rearranged); i++ {
		c := rearranged[i]
		if c >= 'A' && c <= 'Z' {
			val := int(c - 'A' + 10)
			expanded = append(expanded, byte('0'+val/10), byte('0'+val%10))
		} else {
			expanded = append(expanded, c)
		}
	}
	r := 0
	for _, b := range expanded {
		r = (r*10 + int(b-'0')) % 97
	}
	return r == 1
}

// ValidPhone checks if the string contains 5 to 15 digits with or without an
// international '+' prefix and only contains standard phone formatting symbols
// (spaces, dashes, dots, parentheses).
func ValidPhone(phone string) bool {
	digits := 0
	for i := 0; i < len(phone); i++ {
		b := phone[i]
		if b >= '0' && b <= '9' {
			digits++
		} else if b != '+' && b != ' ' && b != '-' && b != '.' && b != '(' && b != ')' {
			return false
		}
	}
	return digits >= 5 && digits <= 15
}
