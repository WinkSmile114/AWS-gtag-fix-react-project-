export const formatNumberAsDollars = (
  n: number | undefined,
  hideSign?: 'show-sign' | 'hide-dollar-sign',
) => {
  if (typeof n == 'undefined') {
    return '';
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    //
  });
  let formatted = formatter.format(n);
  if (hideSign == 'hide-dollar-sign') {
    formatted = formatted.substr(1, formatted.length - 1);
  }
  return formatted;
};

export const formatDate = (d: string | undefined) => {
  if (typeof d == 'undefined') {
    return '';
  }

  const parsedDate = new Date(d);
  const formatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeZone: 'UTC',
  });

  let formatted = formatter.format(parsedDate);
  return formatted;
};

export const isFeatureOn = (
  featureName: 'Finicity' | 'Finch',
): boolean => {
  switch (featureName) {
    case 'Finicity':
      return process.env.REACT_APP_FINICITY_FEATURE_ON == 'YES';
      break;
    case 'Finch':
      return process.env.REACT_APP_FINCH_FEATURE_ON == 'YES';
      break;
  }
  return false;
};

export const stringHasValue = (
  s: string | undefined | null,
): boolean => {
  if (s && s.length > 0) {
    return true;
  }
  return false;
};
