interface Props{

    message:string;

    onConfirm:()=>void;

    onCancel:()=>void;

}

function ConfirmDialog({

    message,

    onConfirm,

    onCancel

}:Props){

    return(

        <div
            className="modal d-block">

            <div
                className="modal-dialog">

                <div
                    className="modal-content">

                    <div
                        className="modal-header">

                        <h5>

                            Confirmation

                        </h5>

                    </div>

                    <div
                        className="modal-body">

                        {message}

                    </div>

                    <div
                        className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onCancel}>

                            Cancel

                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={onConfirm}>

                            Delete

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ConfirmDialog;