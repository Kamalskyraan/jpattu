// src/utilities/nwpCalculator.js
import dayjs from "dayjs";

/**
 * Generate NWP schedule rows for a package.
 * @param {Object} opts
 * @param {number|string} opts.package_amount - total amount (e.g. 10000)
 * @param {string|Date} opts.start_date - start date (ISO or Date) e.g. "2025-10-20"
 * @param {number} [opts.total_days_allowed=400]
 * @returns {Object} { rows: Array, meta: { ... } }
 */
export function generateNwpSchedule({ package_amount, start_date, total_days_allowed = 400 }) {
  if (!package_amount || !start_date) {
    throw new Error("package_amount and start_date are required");
  }

  const packageAmountPaise = Math.round(Number(package_amount) * 100);
  const perDayPaise = Math.floor(packageAmountPaise / total_days_allowed);
  const leftoverPaise = packageAmountPaise - perDayPaise * total_days_allowed;

  let remainingDays = total_days_allowed;
  let current = dayjs(start_date);
  const rows = [];
  let monthIndex = 0;
  let accumulatedPaise = 0;

  while (remainingDays > 0) {
    const endOfMonth = current.endOf("month");
    let daysThisMonth;

    if (monthIndex === 0) {
      const startDayOfMonth = current.date();
      const daysInMonth = endOfMonth.date();
      daysThisMonth = daysInMonth - startDayOfMonth + 1;
    } else {
      daysThisMonth = endOfMonth.date();
    }

    daysThisMonth = Math.min(daysThisMonth, remainingDays);

    let thisRowPaise = perDayPaise * daysThisMonth;
    if (remainingDays - daysThisMonth === 0 && leftoverPaise > 0) {
      thisRowPaise += leftoverPaise;
    }

    const dailyAmount = (perDayPaise / 100).toFixed(2);
    const totalAmount = (thisRowPaise / 100).toFixed(2);
    const earnedForLabel = current.format("MMM YYYY");

    // received date → 5th of next month
    const receivedDate = endOfMonth.add(1, "day").date(10).format("YYYY-MM-DD");
    const earnedDate = endOfMonth.format("YYYY-MM-DD");


    rows.push({
      earnedFor: earnedForLabel,
      year: current.year(),
      totalDays: daysThisMonth,
      dailyAmount,
      totalAmount,
      receivedDate,
      earnedDate,
      paise: thisRowPaise,
    });

    accumulatedPaise += thisRowPaise;
    remainingDays -= daysThisMonth;

    current = endOfMonth.add(1, "day");
    monthIndex += 1;
  }

  return {
    rows,
    meta: {
      totalRows: rows.length,
      totalAmount: (accumulatedPaise / 100).toFixed(2),
      perDayAmount: (perDayPaise / 100).toFixed(2),
      totalDaysAllowed: total_days_allowed,
    },
  };
}
