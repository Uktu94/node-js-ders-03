const fs = require('fs');
const superagent = require('superagent');
const { get } = require('superagent');
const { throws } = require('assert');

const readFilePro = (file) => {
    // Promise constructor
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject('I could not find that file :(');
            resolve(data);
        }); // We are not changing readFile. We're simply creating a new fn
        // Which behind the scenes it still runs the buil in readFile fn
        // Then returns a promise so then we can use instead of the cb funtion
        // readFile fn will do it works and then it's ready will come back with data :D
        // Calling resolve fn will basically mark the promise as successful
        // so as fullfilled. Whatever variable that we pass into the resolve fn
        // It'll be able on the .then() method (as the argument)
        // reject fn will be able on the .catch() method (çünkü neden olmasın :D)
    });
}; // This whole promise thakes a fn which is where we do our async work

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, (err) => {
            if (err) reject("Could't write the file :(");
            resolve('success');
        });
    });
};

// **** ASYNC & AWAIT ****
// async => keeps running in the bg while performing the code that's in it
// while the rest of the code keeps running in the Event Loop (Ders 2)
// await is basically stop the code from running at the point until this promise is resolved
// ÇOK DAHA CLEAN :D
const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`); // same as promise
        console.log(`Breed: ${data}`);

        // .then(res) ile aynı
        const res1Pro = await superagent.get(
            `https://dog.ceo/api/breed/${data}/images/random`);
        const res2Pro = await superagent.get(
            `https://dog.ceo/api/breed/${data}/images/random`);
        const res3Pro = await superagent.get(
            `https://dog.ceo/api/breed/${data}/images/random`);
        // Burada noldu şu oldu 3 variable'ı arr'e aldık,
        // .all() ile containledik
        // await arr içindeki promiseler ile aynı anda çalışacak
        // sonra 3 result valuesunu all variable'ına saveliyoruz
        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        // Burada error aldık
        //console.log(all);

        // İçinde .body.messages barındıran
        // Yeni bir array oluşturmaya ihtiyacımız var
        const imgs = all.map(el => el.body.message)

        console.log(imgs);

        await writeFilePro('dog-img.txt', imgs.join('\n'));
        console.log('Random dog image saved to file!');
    } catch (err) {
        console.log(err);

        throw (err);
    }
    return '2: READY WOOF WOOF' // Result = Promise { <pending> }
};

// ASYNC&AWAIT DAHA CLEAN DAHA İYİ :D
(async () => {
    try {
        console.log('1: Will get dog pics');
        const x = await getDogPic();
        console.log(x);
        console.log('3: DONE getting dog pics!');
    } catch (err) {
        console.log('ERROR!!!');
    }
})();


/* Yukarıda async kullandık ama burada gelip tekrar .then .catch kullandık bunu yapmak yerine
yukarıda yazacağımız kod ile yapabiliriz => IIFE / ASYNC&AWAIT
console.log('1: Will get dog pics');
getDogPic()
    .then(x => {
        console.log(x);
        console.log('3: DONE getting dog pics!');
    }).catch(err => {
        console.log('ERROR!!!');
    }); */ // What we did here
// ERROR!!!or alamamaızın sebebi async successful döndüğü için
// Bunu düzeltmemiz için .catch() methodu kullandık ama hala successfull olarak dönüyordu
// Bunun için de error throwladık :D
// getDogPic returns a promise
// So each time that we hahve a promise we use the .then() method
// in order to get access to its future value
// In that case '2: READY WOOF WOOF' string  will be ready string

// const x = getDogPic();
// console.log(x); // Result = Promise { <pending> }
// Neden böyle bir print ile karşılatık?
// So instead of logging ready to the console at this point
// it just  tells us that x is a PROMISE which at this point is still runnig
// and so it's still pending
// JS can't know that X will be ready string at some point
// And so it simply moves on to the next console.log()
// WHAT SHOULD WE DO IF WE ACTUALLY WANTED TO GET THAT RETURN A VALUE
// We would have to treat this ASYNC FN as a promise
// We would use the .then() method on it or use ASYNC/AWAIT

// What we do in here Utku Bey? All we do is to use the await keyword
// in front of our Promise (readFilePro) and then it wait for that Promise
// to come back with it's result.
// Syntactic sugar for promises (makes me hungry tho LOL)


// --------------------------------------//
// **** PROMISES ****
// CHAIN METHOD (Çok daha clean :D)
/*
readFilePro(`${__dirname}/dog.txt`)
    .then((data) => {
        console.log(`Breed: ${data}`);
        return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    })
    .then((res) => {
        console.log(res.body.message);
        return writeFilePro('dog-img.txt', res.body.message);
    })
    .then(() => {
        console.log('Random dog image saved to file!');
    })
    .catch((err) => {
        console.log(err);
    }); // This one called if there was an error
*/


// CALLBACK HELL :D
// .get()  method returns a promise
/*
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);

    superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        .then(res => {
            console.log(res.body.message);

            fs.writeFile('dog-img.txt', res.body.message, err => {
                if (err) return console.log(err.message);
                console.log('Random dog image saved to file!');
            });
        })
        .catch(err => {
            console.log(err.message);
        }) // This one called if there was an error
});
*/
// If we've multiple promises we will be able to chain these cbs onto one other
// instead of nesting them
// Promise as soon as it comes back with data it's called RESOLVE PROMISE
// It's a pending promise and when it successfully gets the data
// it's resolved promise.
// Resolve promise might not always be successful BC there might been an error
