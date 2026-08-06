const DEFAULT_ITEMS_PER_PAGE = 10;

const raw = process.env.ITEMS_PER_PAGE ?? String(DEFAULT_ITEMS_PER_PAGE);
const parsed = Number(raw);

export const ITEMS_PER_PAGE =
  Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_ITEMS_PER_PAGE;
