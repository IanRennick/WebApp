import './puzzle.css';


// Main puzzle component
const Puzzle = () => {



    return (
        <div className='puzzle_container'>
            {/* Quiz Title */}
            <h1 className='puzzle_type'>Puzzle Type</h1>
            <hr className='puzzle_type_hr'/>

            {/* Keyword */}
            <h2 className='keyword'>Keyword</h2>

            {/* Prompt */}
            <h2 className='prompt'>This is the prompt sentence if needed</h2>

            {/* Main */}
            <h2 className='puzzle_main'>This is the Main part of the puzzle</h2>

             {/* Options */}
            <ul>
                <li className='puzzle_option'>Option1</li>
                <li className='puzzle_option'>Option2</li>
                <li className='puzzle_option'>Option3</li>
                <li className='puzzle_option'>Option4</li>
            </ul>

            <input className='puzzle_input' type='text' placeholder='Enter Answer'/>

            {/* Next Question Button */}      
            <button className='next_button'>Next</button>
        </div>
    );
};

export default Puzzle;