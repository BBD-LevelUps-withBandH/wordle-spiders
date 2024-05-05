

let localMode = true;


export async function getWordOfTheDay() {
    if (localMode == true)
    return 'toxic';
  
    const request = await fetch(`${baseUrl}/Game/getWord`);
    const data = await request.json();
    console.log(data.word);
    return data.word;
}