import React from 'react';

const Rank = ({name, entries}) => {
	return (
		<div>
			{`${name}, your attempted face detection count is: `}
      		<div className='white f1 '>
        		{entries}
     		 </div>
		</div>
	);
}

export default Rank;