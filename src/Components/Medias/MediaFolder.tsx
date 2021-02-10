import React from 'react';
import { makeStyles, Theme, createStyles, IconButton, Typography } from '@material-ui/core';
import { TreeItem } from '@material-ui/lab';
import AddIcon from '@material-ui/icons/Add';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { ID } from 'rx-drag/models/baseTypes';
import { useMutation } from '@apollo/react-hooks';
import { MUTATION_ADD_FOLDER } from './MediasGQLs';
import { useShowAppoloError } from 'Store/Helpers/useInfoError';
import { observer } from 'mobx-react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelRoot: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1, 0),
      height:'30px',
      userSelect:'none',
    },

    labelText: {
      fontWeight: 'inherit',
      flexGrow: 1,
      margintLeft:'4px',
      marginLeft: theme.spacing(1),
    },  
    actions: {
      width:'76px',
      textAlign:'center',
    },
    nameInput:{
      width:'100px',
    }  
  }),
);

export interface FolderNode{
  id:ID;
  name:string;
  children?:Array<FolderNode>;
  editing?:boolean;
  parent?:FolderNode;
}

export function FolderLabel(props:{
    children:any,
  }){
  const classes = useStyles();

  return(
    <Typography variant="body2" 
      className={classes.labelText}
    >
      {props.children}
    </Typography>    
  )
}

export function FolderActions(props:{children:any}){
  const classes = useStyles();

  return(
    <div className={classes.actions}>
      {props.children}
    </div>    
  )
}


export const MediaFolder = observer((props:{ node:FolderNode})=>{
  const {
    node,
  } = props;
  const classes = useStyles();
  const [hover, setHover] = React.useState(false);
  const [editing, setEditing] = React.useState(node.editing);
  const [nodeName, setNodeName] = React.useState(node.name);

  
  const [addFolder, {error:addFolderError}] = useMutation(MUTATION_ADD_FOLDER,
    {
      onCompleted:(data)=>{

      }
    }
  );

  useShowAppoloError(addFolderError);

  const handleEndEditing = ()=>{
    setEditing(false);
    delete node.editing;
    //nodeName !== node.name && onFolderNameChange(nodeName, node);  
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = (event.target as HTMLInputElement).value;
    setNodeName(value);
  };

  const handleDragOver = (event:React.DragEvent<HTMLDivElement>)=>{
    //draggedFolder && draggedFolder !== node && event.preventDefault();
    //draggedMedia && event.preventDefault();
  }

  const handleDrop = ()=>{
    //if(draggedFolder && draggedFolder !== node){
    //  onMoveFolderTo(draggedFolder, node);
    //}
    //if(draggedMedia){
    //  onMoveMediaTo(draggedMedia, node);
    //}
  }

  const handelAddFolder = ()=>{

  }

  const handleRemoveFolder = ()=>{

  }

  const handleDragEnd = ()=>{

  }

  return(
    <TreeItem nodeId={node.id.toString()} label={
      <div 
        className={classes.labelRoot}
        onMouseOver = {()=>setHover(true)}
        onMouseLeave = {()=>setHover(false)}
          draggable={true}
          onDragStart={()=>{
            setHover(false);
            //onDragStart(node);
          }}
          onDragOver = {handleDragOver}
          onDragEnd = {handleDragEnd}
          onDrop = {handleDrop}         
        >
        <FolderOpenIcon />
        <FolderLabel>
          {
            editing?
            <input 
              value={nodeName} 
              autoFocus= {true} 
              className={classes.nameInput}
              onBlur = {handleEndEditing}
              onKeyUp = {e=>{
                if(e.key === 'Enter') {
                  handleEndEditing()
                }
              }}

              onClick = {e=>e.stopPropagation()}
              onChange = {handleChange}
            />
            :
            nodeName
          }
        </FolderLabel>
        {
          hover&&
          <FolderActions>
            <IconButton size = "small" onClick={(e)=>{
              e.stopPropagation();
              setEditing(true);
            }}>
              <EditIcon fontSize = "small" />
            </IconButton>
            <IconButton size = "small" onClick={handelAddFolder}>
              <AddIcon fontSize = "small" />
            </IconButton>
            <IconButton size = "small"  onClick={handleRemoveFolder}>
              <DeleteIcon fontSize = "small" />
            </IconButton>
          </FolderActions>
        }
      </div>}
    >
      {
        node.children?.map((child)=>{
          return(
            <MediaFolder 
              key={child.id + '-' + child.name}               
              node = {child}
            />
          )
        })
      }
    </TreeItem>

  )
})