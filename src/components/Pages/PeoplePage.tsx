import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../Loader';
import { Person } from '../../types/Person';
import { getPeople } from '../../api';
import { PersonLink } from '../PersonLink';

export const PeoplePage: React.FC = () => {
  const { slug } = useParams();

  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    setError(null);

    getPeople()
      .then(data => {
        if (isCancelled) {
          return;
        }

        setPeople(data);
      })
      .catch(() => {
        if (isCancelled) {
          return;
        }

        setError('Something went wrong');
      })
      .finally(() => {
        if (isCancelled) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const noPeople = !isLoading && !error && people.length === 0;
  const hasPeople = !isLoading && !error && people.length > 0;

  return (
    <main className="section">
      <div className="container">
        <h1 className="title">People Page</h1>

        <div className="block">
          <div className="box table-container">
            {isLoading && (
              <div data-cy="loader">
                <Loader />
              </div>
            )}

            {error && (
              <p data-cy="peopleLoadingError" className="has-text-danger">
                {error}
              </p>
            )}

            {noPeople && (
              <p data-cy="noPeopleMessage">There are no people on the server</p>
            )}

            {hasPeople && (
              <table
                data-cy="peopleTable"
                className="table is-striped is-hoverable is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sex</th>
                    <th>Born</th>
                    <th>Died</th>
                    <th>Mother</th>
                    <th>Father</th>
                  </tr>
                </thead>

                <tbody>
                  {people.map(person => {
                    const isSelected = person.slug === slug;

                    const motherName = person.motherName?.trim();
                    const fatherName = person.fatherName?.trim();

                    const byName = new Map(people.map(p => [p.name, p]));
                    const mother = motherName
                      ? byName.get(motherName)
                      : undefined;
                    const father = fatherName
                      ? byName.get(fatherName)
                      : undefined;

                    return (
                      <tr
                        key={person.slug}
                        data-cy="person"
                        className={isSelected ? 'has-background-warning' : ''}
                      >
                        <td>
                          <PersonLink person={person} />
                        </td>

                        <td>{person.sex}</td>
                        <td>{person.born}</td>
                        <td>{person.died}</td>

                        <td>
                          {!motherName ? (
                            '-'
                          ) : mother ? (
                            <PersonLink person={mother} />
                          ) : (
                            motherName
                          )}
                        </td>

                        <td>
                          {!fatherName ? (
                            '-'
                          ) : father ? (
                            <PersonLink person={father} />
                          ) : (
                            fatherName
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
