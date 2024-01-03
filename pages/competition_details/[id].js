import HiddenLayout from "../../components/hidden_layout";
import * as bl from "../../util/BusinessLogic/competition";


export default function CompetitionDetails( {code, teacher, phrase, repetitions, startAt, EndAt} ) {
    
    return (
        <HiddenLayout title="konkurs">
            <div className='col'>
                <div>
                    <h1>Konkurs Szybkiego Pisania</h1>
                </div>
                <div>
                    <div>kod dostępu <span>{code}</span></div>
                    <div>nauczyciel: <span>{teacher}</span></div>
                    <div>tekst do przepisania: <span>{phrase}</span></div>
                    <div>ilosć powtórzeń: <span>{repetitions}</span></div>
                    <div>początek: <span>{startAt}</span></div>
                    <div>koniec: <span>{EndAt}</span></div>
                </div>
            </div>
        </HiddenLayout>
    );
}

export async function getServerSideProps({ query }) {
    const id = query.id;
    const competition = await bl.get(id)

    console.log(id);

    return { props: {
        code: competition.code,
        teacher: competition.teacher,
        phrase: competition.phrase,
        repetitions: competition.repetitions,
        startAt: competition.start_at,
        EndAt: competition.end_at,
    } }
}
