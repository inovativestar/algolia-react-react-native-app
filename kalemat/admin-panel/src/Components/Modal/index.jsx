import React from 'react'
import ReactModal from 'react-modal'
import { Scrollbars } from 'react-custom-scrollbars'

ReactModal.setAppElement('#root')

ReactModal.defaultStyles.content = {
    WebkitOverflowScrolling: 'touch',
    background: 'rgba(255,255,255,.9)',
    position: 'absolute',
    width: '700px',
    height: '500px',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
    margin: 'auto',
    outline: 'none',
    borderRadius: '3px',
    padding: '0px',
    boxShadow: '0 1px 3px rgba(0,0,0,.2)'
}

ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(33,33,33,.7)'

export const Modal = ({ isOpen, closeHandler, children }) =>
    <ReactModal
        isOpen={isOpen}
        onRequestClose={closeHandler}
        contentLabel="Edit lyrics"
    >
        <Scrollbars>
            <div style={{
                padding: "30px 40px"
            }}>
                {children}
            </div>
        </Scrollbars>
    </ReactModal>
