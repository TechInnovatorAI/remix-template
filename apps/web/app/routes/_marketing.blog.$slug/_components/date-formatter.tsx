import { format, parseISO } from 'date-fns';

type Props = {
  dateString: string;
};

export const DateFormatter = ({ dateString }: Props) => {
  const date = parseISO(dateString);

  return <time dateTime={dateString}>{format(date, 'PP')}</time>;
};
