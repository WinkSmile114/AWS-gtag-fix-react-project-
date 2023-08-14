export interface DocumentSection {
  theTag: 'p' | 'h1' | 'h3' | 'h5';
  theText: string;
}

export const generateContract1 = (
  accountLegalName: string,
): DocumentSection[] => {
  return [
    {
      theTag: 'h3',
      theText: ` Banking Agreement Between ${accountLegalName} and Payro Finance`,
    },
    {
      theTag: 'p',
      theText: ` THIS AGREEMENT made this ${new Date().toLocaleDateString()} Day is between ${accountLegalName} hereby referred to
    as "the borrower"...`,
    },

    {
      theTag: 'p',
      theText: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fringilla lacinia varius. Nulla sit amet pharetra sapien, a vehicula tellus. Morbi sagittis mi ut eros dictum, sed vehicula magna pellentesque. Suspendisse cursus massa vel libero maximus volutpat non quis nisi. Donec ornare efficitur tempus. Nulla ullamcorper imperdiet maximus. Integer quis condimentum purus, quis sagittis nisi. Integer dignissim nisl nec libero viverra interdum. Curabitur dolor ante, imperdiet a consectetur et, semper eu odio. Donec ut odio quis tellus mollis vehicula a quis eros. Aliquam at auctor sem.

Nulla tempor sit amet lacus nec dictum. Nunc in tellus ac lacus fringilla mollis. Ut vitae turpis massa. Sed nec est lectus. Nunc venenatis velit in massa auctor, eget porttitor est mollis. Integer malesuada leo in posuere tempor. Pellentesque ut lectus leo. Aliquam eros leo, varius vitae fringilla et, malesuada sed erat. Quisque cursus est nibh, sed mattis arcu vulputate quis. Fusce vel erat dolor. Suspendisse vestibulum lorem eget libero porttitor laoreet.

Integer nec leo sit amet augue rhoncus imperdiet. Aliquam purus leo, accumsan a vehicula rutrum, sodales non erat. Morbi sem orci, ultricies at mauris ut, ultricies lobortis erat. Mauris id vulputate sem. Fusce lobortis tortor sed ornare blandit. Quisque suscipit posuere enim, vitae euismod ante viverra sed. In maximus purus eget interdum condimentum.

In vel ornare felis, vitae varius eros. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam sit amet justo at mauris iaculis suscipit. Nullam blandit lectus et velit congue, sed pulvinar lorem commodo. Mauris sollicitudin, neque quis maximus porttitor, velit ligula cursus diam, ac venenatis purus dui in mi. Pellentesque placerat, ligula ut pellentesque efficitur, quam enim porta dui, at porttitor elit eros mollis enim. Aenean magna lectus, bibendum vitae ipsum quis, varius dignissim est. Nam blandit pellentesque justo sit amet rhoncus. Curabitur in suscipit nisl. In augue leo, condimentum a ex ut, pretium elementum lectus. In suscipit iaculis neque. Duis leo lacus, sodales ut nibh eu, commodo consequat massa. Nullam suscipit iaculis nulla, ut fringilla eros tincidunt eget. Vivamus dolor enim, sodales nec fringilla in, consectetur at quam. Fusce sit amet leo accumsan, commodo ex eu, placerat dui.

Donec odio ipsum, varius eget convallis et, consectetur iaculis sapien. Vestibulum fermentum metus ut dui eleifend, sit amet semper tortor fermentum. Mauris non elit ante. Etiam molestie malesuada felis, sed euismod diam viverra volutpat. Sed bibendum libero vitae felis hendrerit, vitae convallis sem tincidunt. Donec pulvinar in diam id porttitor. Ut quis ex consectetur, semper ex eget, posuere turpis. Etiam sit amet orci nec ex porttitor facilisis.
  
    `,
    },
  ];
};

export const getSignatureDisclaimer = (accountLegalName: string) => {
  return `I understand and agree that by clicking the “I Agree  Sign Document” button below, I will be signing the document on behalf of ${accountLegalName} with my electronic signature.  I certify that I am authorized to sign the documents on behalf of ${accountLegalName}, and I intend my electronic signature to have the same legal effect as if I signed the document on behalf of ${accountLegalName} with a handwritten signature.
    `;
};
