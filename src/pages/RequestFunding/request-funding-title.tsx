interface RequestFundingTitle {
  title: string;
  subtitle: string;
  sectionNumber?: number | undefined;
  section?: 'onboarding' | 'more-funding' | 'manual-bank';
  centered?: boolean;
  fundingStep?: 'confirm';
}

export default (props: RequestFundingTitle) => {
  return (
    <div
      id={
        props.fundingStep == 'confirm'
          ? 'request-funding-title-wrapper-confirm'
          : 'request-funding-title-wrapper'
      }
      className={
        props.section + (props.centered ? ' title-centered' : '')
      }
    >
      {props.sectionNumber && (
        <div
          id="request-funding-section-number"
          className={props.section}
        >
          {props.sectionNumber}
          <span id="title-period-after-number">.</span>
        </div>
      )}
      <div id="request-funding-section-title-text-wrapper">
        <h1
          id="request-funding-section-title"
          className={
            props.fundingStep ? props.fundingStep : props.section
          }
        >
          {props.title}
        </h1>
        <h1
          id="request-funding-section-subtitle"
          className={props.section}
        >
          {props.subtitle}
        </h1>
      </div>
    </div>
  );
};
