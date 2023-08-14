import { useEffect } from 'react';
import { useRef } from 'react';
import './index.scss';

interface SignatureCanvasProps {
  fullName: string;
  getDataUrlCb: (theUrl: any) => any;
}

export default (props: SignatureCanvasProps) => {
  const canvasRef = useRef<any>(null);

  const canvasWidth = props.fullName.length < 20 ? '225px' : '350px';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      context.font = '20px indie-flower';
      context.fillText(props.fullName, 10, 100);
      const theCanvasUrl = canvas.toDataURL();
      props.getDataUrlCb(theCanvasUrl);
    }
  }, []);

  return (
    <div id="canvas-wrapper">
      <canvas
        id="actual-canvas"
        height={'110px'}
        width={canvasWidth}
        ref={canvasRef}
      />
    </div>
  );
};
