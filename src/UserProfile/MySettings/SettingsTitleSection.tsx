type SettingsTitleSectionProps = {
  title: string;
};

export default (props: SettingsTitleSectionProps) => {
  return (
    <div className="settings-title-wrapper ">
      <p className="settings-title-style">{props.title}</p>
    </div>
  );
};
