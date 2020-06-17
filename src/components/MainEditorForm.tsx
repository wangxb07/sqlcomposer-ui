import React, {FC} from "react";
import AceEditor from "react-ace";
import {Dispatch, iRootState} from "../store";
import {connect} from "react-redux";

const mapState = (state: iRootState) => ({
});

const mapDispatch = (dispatch: Dispatch) => ({
  onChange: dispatch.doc.onChange
});

interface EditorFormProps {
  content: string
}

type connectedProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> & EditorFormProps
type Props = connectedProps;

const MainEditorForm: FC<Props> = ({content, onChange}: Props) => {
  return (
    <AceEditor
      height="55vh"
      placeholder="请输入yaml文本"
      width="100%"
      mode="yaml"
      theme="monokai"
      name="document-editor"
      fontSize={12}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={content}
      onChange={onChange}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}/>
  );
};

// @ts-ignore
export default connect(mapState, mapDispatch)(MainEditorForm)
