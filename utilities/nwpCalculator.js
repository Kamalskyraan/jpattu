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

// ------------------------------------------------

// export function generateNwpSchedule({
//   package_amount,
//   start_date,
//   daily_amt,
//   total_days_allowed = 400,
// }) {
//   if (!package_amount || !start_date) {
//     throw new Error("package_amount and start_date are required");
//   }

//   const dailyAmount = Number(daily_amt);

//   const packageAmountPaise = Math.round(Number(package_amount) * 100);

//   const perDayPaise = Math.floor(packageAmountPaise / total_days_allowed);
//   const leftoverPaise = packageAmountPaise - perDayPaise * total_days_allowed;

//   let remainingDays = total_days_allowed;
//   let current = dayjs(start_date);
//   const rows = [];
//   let monthIndex = 0;
//   let accumulatedPaise = 0;

//   while (remainingDays > 0) {
//     const endOfMonth = current.endOf("month");
//     let daysThisMonth;

//     if (monthIndex === 0) {
//       const startDayOfMonth = current.date();
//       const daysInMonth = endOfMonth.date();
//       daysThisMonth = daysInMonth - startDayOfMonth + 1;
//     } else {
//       daysThisMonth = endOfMonth.date();
//     }

//     daysThisMonth = Math.min(daysThisMonth, remainingDays);

//     let thisRowPaise = perDayPaise * daysThisMonth;
//     if (remainingDays - daysThisMonth === 0 && leftoverPaise > 0) {
//       thisRowPaise += leftoverPaise;
//     }

//     // const dailyAmount = (perDayPaise / 100).toFixed(2);
//     const totalAmount = (thisRowPaise / 100).toFixed(2);
//     const earnedForLabel = current.format("MMM YYYY");

//     // received date → 5th of next month
//     const receivedDate = endOfMonth.add(1, "day").date(10).format("YYYY-MM-DD");
//     const earnedDate = endOfMonth.format("YYYY-MM-DD");

//     rows.push({
//       earnedFor: earnedForLabel,
//       year: current.year(),
//       totalDays: daysThisMonth,
//       dailyAmount,
//       totalAmount,
//       receivedDate,
//       earnedDate,
//       paise: thisRowPaise,
//     });

//     accumulatedPaise += thisRowPaise;
//     remainingDays -= daysThisMonth;

//     current = endOfMonth.add(1, "day");
//     monthIndex += 1;
//   }

//   return {
//     rows,
//     meta: {
//       totalRows: rows.length,
//       totalAmount: (accumulatedPaise / 100).toFixed(2),
//       perDayAmount: (perDayPaise / 100).toFixed(2),
//       totalDaysAllowed: total_days_allowed,
//     },
//   };
// }

export function generateNwpSchedule({
  package_amount,
  start_date,
  daily_amt,
  total_months = 12, // Changed to 12
}) {
  if (!package_amount || !start_date || !daily_amt) {
    throw new Error("package_amount, start_date, and daily_amt are required");
  }

  const dailyAmount = Number(daily_amt);
  let current = dayjs(start_date);
  const rows = [];
  let accumulatedAmount = 0;
  let totalDaysUsed = 0;

  // First month: calculate actual days from start_date to end of month
  const startDayOfMonth = current.date();
  const daysInMonth = current.endOf("month").date();
  const firstMonthDays = daysInMonth - startDayOfMonth + 1;

  // Calculate first month amount
  const firstMonthAmount = dailyAmount * firstMonthDays;
  const firstMonthLabel = current.format("MMM YYYY");

  rows.push({
    earnedFor: firstMonthLabel,
    year: current.year(),
    totalDays: firstMonthDays,
    dailyAmount: dailyAmount.toFixed(2),
    totalAmount: firstMonthAmount.toFixed(2),
    receivedDate: current
      .endOf("month")
      .add(1, "day")
      .date(10)
      .format("YYYY-MM-DD"),
    earnedDate: current.endOf("month").format("YYYY-MM-DD"),
  });

  accumulatedAmount += firstMonthAmount;
  totalDaysUsed += firstMonthDays;

  // Move to next month
  current = current.add(1, "month");

  // Remaining 10 months (total_months - 1 = 11 months)
  // We need to handle month 1-10 normally, and month 11 (12th total) with package_amount * 2
  for (let i = 1; i < total_months; i++) {
    const monthLabel = current.format("MMM YYYY");
    let monthAmount;
    let monthDays;

    // Check if this is the 12th month (index 11, since i goes from 1 to 11)
    if (i === 11) {
      // This is the 12th month
      monthDays = 30; // Or use actual days if you prefer
      monthAmount = Number(package_amount) * 2; // Package amount * 2
    } else {
      monthDays = 30; // Always 30 days for months 2-11
      monthAmount = dailyAmount * monthDays;
    }

    rows.push({
      earnedFor: monthLabel,
      year: current.year(),
      totalDays: monthDays,
      dailyAmount: i === 11 ? "0.00" : dailyAmount.toFixed(2), // No daily amount for final month
      totalAmount: monthAmount.toFixed(2),
      receivedDate: current
        .endOf("month")
        .add(1, "day")
        .date(10)
        .format("YYYY-MM-DD"),
      earnedDate: current.endOf("month").format("YYYY-MM-DD"),
      // Add a flag to identify the special month
      isSpecialMonth: i === 11,
      specialAmount: i === 11 ? `Package Amount × 2` : null,
    });

    accumulatedAmount += monthAmount;
    totalDaysUsed += monthDays;

    // Move to next month
    current = current.add(1, "month");
  }

  return {
    rows,
    meta: {
      totalRows: rows.length,
      totalMonths: total_months,
      totalAmount: accumulatedAmount.toFixed(2),
      perDayAmount: dailyAmount.toFixed(2),
      totalDaysUsed: totalDaysUsed,
      firstMonthDays: firstMonthDays,
      remainingMonths: total_months - 1,
      remainingDays: (total_months - 1) * 30,
      // Add special month info
      specialMonthInfo: {
        monthIndex: 11,
        amount: (Number(package_amount) * 2).toFixed(2),
        description: "Package Amount × 2",
      },
    },
  };
}
