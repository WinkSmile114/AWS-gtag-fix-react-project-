const ProgressBar = (props: any) => {
  const { barcolor, completedcolor, completed } = props;

  const containerStyles = {
    height: 3,
    width: '100%',
    backgroundColor: barcolor,
    borderRadius: 50,
  };

  const fillerStyles = {
    height: 3,
    width: `${completed}%`,
    backgroundColor: completedcolor,
    borderRadius: 50,
  };

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}></span>
      </div>
    </div>
  );
};

export default ProgressBar;
