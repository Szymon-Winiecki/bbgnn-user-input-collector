import HiddenLayout from "../../components/hidden_layout";
import * as bl from "../../util/BusinessLogic/competition";
import { timestampToDateTimeString } from "../../util/formatingUtils";


export default function CompetitionDetails( {code, teacher, phrase, repetitions, startAt, EndAt, results} ) {
    
    return (
        <HiddenLayout title="konkurs">
            <div className='col'>
                <div>
                    <h1>Konkurs Szybkiego Pisania</h1>
                </div>
                <div className='my-2'>
                    Uczniowie, aby wziąć udział w konkursie muszą znać kod dostępu. Na tej stronie przedstawione zostaną wyniki konkursu. Aby mieć do nich dostęp można dodać stronę do zakładek, lub zapisć adres url.
                </div>
                <div className="border-start border-primary-subtle border-3 ps-2">
                    <div className="row"> <div className="col-3">kod dostępu:</div> <div className="col-9 fw-bold">{code}</div></div>
                    <div className="row"> <div className="col-3">nauczyciel:</div> <div className="col-9 fw-bold">{teacher}</div></div>
                    <div className="row"> <div className="col-3">tekst do przepisania:</div> <div className="col-9 fw-bold">{phrase}</div></div>
                    <div className="row"> <div className="col-3">ilosć powtórzeń:</div> <div className="col-9 fw-bold">{repetitions}</div></div>
                    <div className="row"> <div className="col-3">początek:</div> <div className="col-9 fw-bold">{timestampToDateTimeString(startAt)}</div></div>
                    <div className="row"> <div className="col-3">koniec:</div> <div className="col-9 fw-bold">{timestampToDateTimeString(EndAt)}</div></div>
                </div>
            </div>

            <div className='col-12 col-xl-8 row border-bottom border-3 fw-bold'>
                <div className='col-2'>miejsce</div> 
                <div className='col-1'>klasa</div> 
                <div className='col-1'>nr</div> 
                <div className='col-2'>czas</div>
                <div className='col-2'>błędy</div>
                <div className='col-2'>punkty</div>
                <div className='col-2'>ilosc prob</div>
            </div>
        {results.map((result, i) => 
            <div className='col-12 col-xl-8 row border-bottom' key={result.result.username}>
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
