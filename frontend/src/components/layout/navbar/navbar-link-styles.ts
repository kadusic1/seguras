export const linkClass = (active: boolean, underlineOnHover = true) =>
  `flex items-center gap-2 relative pb-1 text-base font-bold italic tracking-wide transition-colors after:transition-opacity after:duration-300 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-white ${
    active
      ? "after:opacity-100"
      : `text-white after:opacity-0 ${
          underlineOnHover ? "hover:after:opacity-100" : "hover:after:opacity-0"
        }`
  }`;

export const sectionLabelClass =
  "flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400";
