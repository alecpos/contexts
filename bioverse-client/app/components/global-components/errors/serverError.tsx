export interface ServerErrorType {
    status: number;
    statusText: string;
}

const ServerError = ({ status, statusText }: ServerErrorType) => (
    <div>
        <div>{status}</div>
        <div>{statusText}</div>
    </div>
);

export default ServerError;
