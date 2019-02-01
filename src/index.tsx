import * as React from 'react';
import transformFiles, { IParsedFiles } from './transformFiles';

interface IProps {
  onDrop?: () => void;
  onParseFiles: (files: IParsedFiles) => void;
  style?: any;
  children?: any;
}

interface IState {
  over: boolean;
}

const containerStyles = {
  textAlign: 'center',
  color: 'rgba(0,0,0,0.4)',
  borderRadius: '5px',
  height: '100%',
  width: '100%',
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'rgba(0,0,0,0)',
  border: '2px dashed rgba(0,0,0,0.2)',
  transitionDuration: '0.2s',
};

const overStyles = {
  background: 'rgba(155,77,202,0.2)',
  border: '2px dashed #9b4dca',
  transitionDuration: '0.1s',
};

class Dropzone extends React.Component<IProps, IState> {
  private timeout: any;
  constructor(props: IProps) {
    super(props);

    this.state = {
      over: false,
    };
  }

  public handleDrop = async (e: React.DragEvent) => {
    if (this.props.onDrop) {
      this.props.onDrop();
    }
    e.preventDefault();
    e.persist();

    // console.log('pre transforming files');
    const folders = await transformFiles(e);
    // console.log('post transforming files');
    if (e.dataTransfer.items) {
      e.dataTransfer.items.clear();
    } else {
      e.dataTransfer.clearData();
    }
    this.props.onParseFiles(folders);
  }

  public handleDrag = (over: boolean) => {
    return (e: React.DragEvent) => {
      e.preventDefault();
      this.setState({
        over,
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public stop = (e: any) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.state.over === false) {
      this.setState({
        over: true,
      });
    }
    this.timeout = setTimeout(() => {
      this.setState({
        over: false,
      });
    }, 50);
    e.preventDefault();
  }

  public render() {
    return (
      <div
        style={{
          ...containerStyles,
          ...(this.state.over ? overStyles : {}),
          ...this.props.style,
        }}
        draggable={true}
        onDrop={this.handleDrop}
        onDragOver={this.stop}
      >
        {this.props.children || defaultPlaceholder}
        <input
          style={{
            display: 'none'
          }}
          type="file"
          name="files[]"
          data-multiple-caption="{count} files selected"
          multiple={true}
        />
      </div>
    );
  }
};

const defaultPlaceholder = (
  <span>Drop Images To Begin Training</span>
);

export default Dropzone;
