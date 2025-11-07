/* eslint-disable @typescript-eslint/indent */
import { Link, useParams } from 'react-router-dom';
import { Person } from '../types/Person';

type Props =
  | {
      person: Person;
      personName?: never;
      people?: never;
    }
  | {
      personName: string | null;
      people: Person[];
      person?: never;
    };

export const PersonLink: React.FC<Props> = props => {
  const { slug } = useParams();

  let foundPerson: Person | undefined;

  if ('person' in props) {
    foundPerson = props.person;
  } else if (props.personName) {
    foundPerson = props.people.find(p => p.name === props.personName);
  }

  if (!foundPerson) {
    return <span>{'personName' in props ? props.personName || '-' : '-'}</span>;
  }

  const isWoman = foundPerson.sex === 'f';
  const isActive = foundPerson.slug === slug;

  return (
    <Link
      to={`/people/${foundPerson.slug}`}
      className={[
        isWoman ? 'has-text-danger' : '',
        isActive ? 'has-text-link' : '',
      ]
        .join(' ')
        .trim()}
      data-cy="person-link"
    >
      {foundPerson.name}
    </Link>
  );
};
