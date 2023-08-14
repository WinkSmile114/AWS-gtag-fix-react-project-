type TitleSectionProps = {
  title: string;
  subtitle?: string;
  pageTitle?: string;
  pageNumAndOutOf?: string;
  centered?: boolean;
  titleIcon?: any;
};

export default (props: TitleSectionProps) => {
  const titleSectionWrapperClass =
    'title-section-wrapper' + (props.centered ? ' centered' : '');
  const headerTitleClass =
    'header-title' + (props.centered ? ' centered' : '');
  const headerSubtitlteClass =
    'subtitle' + (props.centered ? ' centered' : '');
  return (
    <div className={titleSectionWrapperClass}>
      {props.titleIcon && (
        <img className="title-image" src={props.titleIcon} />
      )}
      {props.pageTitle && props.pageNumAndOutOf && (
        <div id="page-title-number-container">
          {/* <p className="information">Information / <span className="page-title">{props.pageTitle}</span></p> */}
          <p className="page-title">{props.pageTitle}</p>
          <p className="page-number-application">
            {props.pageNumAndOutOf}
          </p>
        </div>
      )}

      <p className={headerTitleClass}>{props.title}</p>
      <p className={headerSubtitlteClass}>{props.subtitle}</p>
    </div>
  );
};
