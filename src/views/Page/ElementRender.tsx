import React, { Fragment } from 'react';
import { resolveNode } from 'designer/Core/resoveNode';
import { RXElement } from './RXElement';

export default function ElementRender(props:{element:RXElement}){
  const {element} = props;

  const Element = resolveNode(element.meta.name);

  return(
    <Fragment>
    {(element.children && element.children.length > 0) || element.meta.text ?
      (<Element {...element.meta.props}>
        {element.meta.text}
        {element.children?.map((child: RXElement)=>{
          return (
            <ElementRender key={child.id} element={child} />
          )
        })}
      </Element>)
      :
      <Element {...element.meta.props} />
    }
    </Fragment>
  )
}
