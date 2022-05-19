import React from 'react'

const stylesheet = `
    .brand-color {
        background: #10122E!important;
    }
`

export default function Modal({setName, setEmail, body}) {

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {body}
                    </div>
                    <div className="modal-footer d-inline">
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button type="button" className="btn btn-primary mb-1">Применить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    )
}