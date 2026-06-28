const SEAT_TYPES = require('../constants/seatTypes');

/**
 * Generates an array of seat documents ready for Seat.insertMany().
 *
 * Seat Labeling:
 *   - Rows are labeled A, B, C, ... (max Z = 26 rows)
 *   - Columns are numbered 1, 2, 3, ...
 *   - Label = rowLetter + columnNumber (e.g. "A1", "B12")
 *
 * VIP Rule (Business Rule):
 *   The last VIP_ROW_COUNT rows are designated as VIP seats.
 *   TODO: Make VIP_ROW_COUNT configurable via hall-level config or admin settings.
 *   To change the rule, update the VIP_ROW_COUNT constant below or
 *   replace the isVipRow condition with a more complex layout strategy.
 */
const VIP_ROW_COUNT = 2; // Last N rows are VIP

const generateSeats = (hallId, totalRows, totalColumns) => {
  const seats = [];

  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    const rowLetter = String.fromCharCode(65 + rowIndex); // 65 = 'A'

    // BUSINESS RULE: Last VIP_ROW_COUNT rows are VIP
    // To customize: change VIP_ROW_COUNT or replace this with a per-row config
    const isVipRow = rowIndex >= totalRows - VIP_ROW_COUNT;
    const seatType = isVipRow ? SEAT_TYPES.VIP : SEAT_TYPES.STANDARD;

    for (let col = 1; col <= totalColumns; col++) {
      seats.push({
        hall: hallId,
        row: rowLetter,
        number: col,
        label: `${rowLetter}${col}`,
        type: seatType,
        isActive: true,
      });
    }
  }

  return seats;
};

module.exports = { generateSeats, VIP_ROW_COUNT };
