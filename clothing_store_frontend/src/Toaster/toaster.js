import React, { Component, useEffect, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'

function Toaster(props) {

    return (
        <>
            <div className="col-md-6">
                <ToastContainer position="top-end">
                    <Toast className='d-inline-block m-1' bg={props.className} onClose={() => props.setShow(false)} show={props.show} delay={3000} autohide animation={true}>
                        <Toast.Header>
                            <strong className="me-auto">{props.message}</strong>
                        </Toast.Header>
                    </Toast>
                </ToastContainer>
            </div>
        </>
    );
}
export default Toaster