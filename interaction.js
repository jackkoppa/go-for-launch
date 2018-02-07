const FADE_DURATION = 500;
const BG_OPACITY_RATIO = 2;

let changeAlertVisibility = (visibility, opacity) => {
    let alert = document.getElementById('alert');
    let alertBackground = document.getElementById('alert-background');
    let setVisibility = () => {
        alert.style.visibility = visibility;
        alertBackground.style.visibility = visibility;        
    }
    if (visibility === 'hidden') 
        setTimeout(() => setVisibility(), FADE_DURATION)
    else
        setVisibility();
    
    alert.style.opacity = opacity;
    alertBackground.style.opacity = opacity / BG_OPACITY_RATIO;
}

let openAlert = () => {
    changeAlertVisibility('visible', 1);
}

let closeAlert = () => {
    changeAlertVisibility('hidden', 0);
}
