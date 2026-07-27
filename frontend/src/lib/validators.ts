export function maxLength(max: number, label: string) {
  return (value: string) => {
    if (!value) return true;
    if (value.length > max) return `${label} cannot exceed ${max} characters.`;
    return true;
  };
}

export function dateInPast() {
  return (value: string) => {
    if (!value) return true;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Enter a valid date.";
    if (date >= new Date()) return "Date of birth must be in the past.";
    return true;
  };
}

export function validPhone() {
  return (value: string) => {
    if (!value) return true;
    const digitsOnly = value.replace(/\D/g, "");
    const hasValidChars = /^[\d +\-().]+$/.test(value);
    return (
      (hasValidChars && digitsOnly.length >= 5 && digitsOnly.length <= 15) ||
      "Enter a valid phone number"
    );
  };
}

export function validBSN() {
  return (value: string) => {
    if (!value) return true;
    const digits: number[] = [];
    for (let i = 0; i < value.length; i++) {
      const c = value[i];
      if (c >= "0" && c <= "9") {
        digits.push(Number(c));
      } else if (c !== " " && c !== "." && c !== "-") {
        return "BSN may only contain digits, spaces, dots, or hyphens.";
      }
    }
    if (digits.length !== 8 && digits.length !== 9) {
      return "BSN must be 8 or 9 digits.";
    }
    if (digits.length === 8) {
      digits.unshift(0);
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      const w = i === 8 ? -1 : 9 - i;
      sum += digits[i] * w;
    }
    if (sum % 11 !== 0 || sum === 0) {
      return "That doesn't look like a real BSN.";
    }
    return true;
  };
}

export function validIBAN() {
  return (value: string) => {
    if (!value) return true;
    const clean: string[] = [];
    for (let i = 0; i < value.length; i++) {
      const c = value[i].toUpperCase();
      if (c === " ") continue;
      clean.push(c);
    }
    if (clean.length !== 18 || clean[0] !== "N" || clean[1] !== "L") {
      return "Dutch IBAN must start with NL and be exactly 18 characters.";
    }
    for (let i = 2; i < 4; i++) {
      if (clean[i] < "0" || clean[i] > "9") return "Invalid IBAN format.";
    }
    for (let i = 4; i < 8; i++) {
      if (clean[i] < "A" || clean[i] > "Z") return "Invalid IBAN format.";
    }
    for (let i = 8; i < 18; i++) {
      if (clean[i] < "0" || clean[i] > "9") return "Invalid IBAN format.";
    }
    const rearranged = clean.slice(4).join("") + clean.slice(0, 4).join("");
    let expanded = "";
    for (const c of rearranged) {
      if (c >= "A" && c <= "Z") {
        expanded += (c.charCodeAt(0) - 65 + 10).toString();
      } else {
        expanded += c;
      }
    }
    let r = 0;
    for (const c of expanded) {
      r = (r * 10 + Number(c)) % 97;
    }
    if (r !== 1) return "That doesn't look like a real IBAN.";
    return true;
  };
}

export function isNumeric(label: string) {
  return (value: string) => {
    if (value === "" || value == null) return true;
    if (!/^\d+$/.test(value)) return `${label} must only contain digits.`;
    return true;
  };
}

export function inRange(min: number, max: number, label: string) {
  return (value: string) => {
    const num = Number(value);
    if (Number.isNaN(num)) return `${label} must be a valid number.`;
    if (num < min || num > max)
      return `${label} must be between ${min} and ${max}.`;
    return true;
  };
}
