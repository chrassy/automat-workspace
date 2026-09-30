"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.parseDate = parseDate;
exports.getTodayDateString = getTodayDateString;
exports.getYesterdayDateString = getYesterdayDateString;
exports.addDays = addDays;
exports.daysBetween = daysBetween;
exports.getDayOfWeek = getDayOfWeek;
exports.getStartOfWeek = getStartOfWeek;
exports.getDatesInRange = getDatesInRange;
exports.isHabitScheduledForDate = isHabitScheduledForDate;
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function parseDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0); // Midday to prevent DST edge shifts
}
function getTodayDateString() {
    return formatDate(new Date());
}
function getYesterdayDateString() {
    return addDays(getTodayDateString(), -1);
}
function addDays(dateStr, days) {
    const d = parseDate(dateStr);
    d.setDate(d.getDate() + days);
    return formatDate(d);
}
function daysBetween(dateStr1, dateStr2) {
    const d1 = parseDate(dateStr1);
    const d2 = parseDate(dateStr2);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
function getDayOfWeek(dateStr) {
    return parseDate(dateStr).getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}
function getStartOfWeek(dateStr) {
    const d = parseDate(dateStr);
    const day = d.getDay();
    // We'll treat Monday (1) as start of week, Sunday (0) as 7th day
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return formatDate(d);
}
function getDatesInRange(startDateStr, endDateStr) {
    const dates = [];
    let current = startDateStr;
    while (current <= endDateStr) {
        dates.push(current);
        current = addDays(current, 1);
    }
    return dates;
}
function isHabitScheduledForDate(frequency_type, target_days, dateStr) {
    if (frequency_type === 'daily') {
        return true;
    }
    if (frequency_type === 'custom_days') {
        const dayOfWeek = getDayOfWeek(dateStr);
        return target_days.includes(dayOfWeek);
    }
    if (frequency_type === 'weekly') {
        return true;
    }
    return true;
}
