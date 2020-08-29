import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) => {
		if (isSignedIn){
			return(
				<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
					<p onClick={ ()=>onRouteChange('signout')} 
					   className='f5 link dim black underline pa3 pointer'>Sign Out</p>
				</nav>
			)
		} else {
			return( <div />)
		}
}

export default Navigation;