import HiddenLayout from "../../components/hidden_layout";
import * as bl from "../../util/BusinessLogic/competition";


export default function CompetitionDetails( {code, teacher, phrase, repetitions, startAt, EndAt, results} ) {
    
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

            <div className='col-6 row border-bottom border-3 fw-bold'>
                <div className='col-2'>miejsce</div> 
                <div className='col-1'>klasa</div> 
                <div className='col-1'>nr</div> 
                <div className='col-2'>czas</div>
                <div className='col-2'>błędy</div>
                <div className='col-2'>punkty</div>
                <div className='col-2'>ilosc prob</div>
            </div>
        {results.map((result, i) => 
            <div className='col-6 row border-bottom'>
                <div className='col-2'>{i}.</div> 
                <div className='col-1'>{result.result.classNumber}</div> 
                <div className='col-1'>{result.result.studentNumber}</div> 
                <div className='col-2'>{(result.result.time / 1000).toFixed(3)} s</div>
                <div className='col-2'>{result.result.typos} błędów</div>
                <div className='col-2'>{result.result.score.toFixed(3)}</div>
                <div className='col-2'>{result.count}</div>
            </div> )}
        </HiddenLayout>
    );
}

export async function getServerSideProps({ query }) {
    const id = query.id;
    const competition = await bl.get(id)

    const results = await bl.getResultsForCompetitions(id);

    return { props: {
        code: competition.code,
        teacher: competition.teacher,
        phrase: competition.phrase,
        repetitions: competition.repetitions,
        startAt: competition.start_at,
        EndAt: competition.end_at,
        results: results,
    } }
}
