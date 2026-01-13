import { format, parse, isValid, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

// Format date based on user preference
export function formatDate(date: Date, formatStr: string = 'DD/MM/YYYY'): string {
  try {
    // Map common format strings to date-fns format
    const formatMap: Record<string, string> = {
      'DD/MM/YYYY': 'dd/MM/yyyy',
      'MM/DD/YYYY': 'MM/dd/yyyy',
      'YYYY-MM-DD': 'yyyy-MM-dd',
      'DD-MM-YYYY': 'dd-MM-yyyy',
    };
    
    const dateFnsFormat = formatMap[formatStr] || formatStr;
    return format(date, dateFnsFormat);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toLocaleDateString();
  }
}

// Parse date string
export function parseDate(dateString: string, formatStr: string = 'DD/MM/YYYY'): Date | null {
  try {
    const formatMap: Record<string, string> = {
      'DD/MM/YYYY': 'dd/MM/yyyy',
      'MM/DD/YYYY': 'MM/dd/yyyy',
      'YYYY-MM-DD': 'yyyy-MM-dd',
      'DD-MM-YYYY': 'dd-MM-yyyy',
    };
    
    const dateFnsFormat = formatMap[formatStr] || formatStr;
    const parsed = parse(dateString, dateFnsFormat, new Date());
    
    if (isValid(parsed)) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}

// Get month range
export function getMonthRange(year: number, month: number): { start: Date; end: Date } {
  const date = new Date(year, month, 1);
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

// Get year range
export function getYearRange(year: number): { start: Date; end: Date } {
  const date = new Date(year, 0, 1);
  return {
    start: startOfYear(date),
    end: endOfYear(date),
  };
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Get month name
export function getMonthName(month: number): string {
  const date = new Date(2000, month, 1);
  return format(date, 'MMMM');
}

// Get short month name
export function getShortMonthName(month: number): string {
  const date = new Date(2000, month, 1);
  return format(date, 'MMM');
}

