import React, { FC, ReactNode } from 'react'
import '../css/modal.css'

// TODO 전역 모달로 사용 할 수 있는 부분을 새롭게 만들어야 된다
interface Props {
  open : boolean;
  close : () => void;
  header : string;
  children : ReactNode;  //원하는 걸 부모창에서 받아 온다 <modal>안에있는게 넘어 온다</modal> 태그 안에 먼가 있어야 된다
}
const Modal:FC<Props> = (props) => {
  
  const { open, close, header } = props;
  return (
    <div>
      {/*       // 모달이 열릴때 openModal 클래스가 생성된다. */}
      <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
          <section>
            <header>
              {header}
              <button className="close" onClick={close}>
                &times;
              </button>
            </header>
            {/* 부모창에서 받아 온 값을 뿌린다. */}
            <main className="modal-body">{props.children}</main>
            <footer>
              <button className="close" onClick={close}>close</button>
            </footer>
          </section>
        ) : null }
      </div>
    </div>
  )
}

export default Modal

