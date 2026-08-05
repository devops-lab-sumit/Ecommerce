interface Props{

    message:string;

}

function EmptyState({message}:Props){

    return(

        <div
            className="text-center p-5">

            <h5 className="text-secondary">

                {message}

            </h5>

        </div>

    );

}

export default EmptyState;