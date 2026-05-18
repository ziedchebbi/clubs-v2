type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center">
      <p>{message}</p>
    </div>
  );
}
