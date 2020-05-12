const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/mutation', (req, res) => {
    let body = req.body;
    console.log(body.dna);
    let valida = validate(body.dna);

    MongoClient.connect("mongodb://mut_user:m8t4t10n@ds161028.mlab.com:61028/heroku_gttjjfh2", function(err, db) {
        if (err) throw err;
        var dbo = db.db("heroku_gttjjfh2");
        var cursor = dbo.collection('mutations').find({ dna: "body.dna" });
        if (!cursor.hasNext) {
            dbo.collection("mutations").insertOne({ dna: body.dna, status: valida }, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        } else {
            res.status(200).json({
                msg: 'Repeated mutation'
            });
        }
        if (!valida) {
            res.status(403).json({
                ok: false,
                msg: 'No mutation'
            })
        } else {
            res.status(200).json({
                msg: 'Mutation'
            });
        }

    });

})
app.get('/stats', (req, res) => {
    MongoClient.connect("mongodb://mut_user:m8t4t10n@ds161028.mlab.com:61028/heroku_gttjjfh2", function(err, db) {

        if (err) throw err;
        var dbo = db.db("heroku_gttjjfh2");
        var noMutations = 4;
        var mutations = 5;

        var arr = dbo.collection('mutations').aggregate([
            { "$group": { _id: "$status", count: { $sum: 1 } } }
        ]).toArray().then((data) => {
            console.log(data);
            mutation = data.find((k, v) => k['_id'] == true);
            noMutation = data.find((k, v) => k['_id'] == false);
            cMutations = mutation['count'] ? mutation['count'] : 0;
            nNoMutations = noMutations['count'] ? noMutations['count'] : 0;
            res.json({
                'count_mutations': cMutations,
                'count_no_mutation': nNoMutations,
                'ratio': cMutations / (nNoMutations + cMutations)
            });
        });
    });
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

let validate = (dna) => {
    let x = 0,
        y = 0,
        ix = 0,
        iy = 0,
        rep = 0,
        count = 0;
    var mat = [];
    dna.forEach((element) => {
        mat.push(element.split(""));
    });
    size = dna.length;
    for (let i = 0; i < size; i++) {
        hor = 0;
        ver = 0;
        for (let j = 0; j < size; j++) {
            if (j + 1 == size)
                break;
            //Horizontal    
            if (mat[i][j] == mat[i][j + 1]) hor++;
            else hor = 0;

            if (hor == 3) count++;
            //Vertical
            if (mat[j][i] == mat[j + 1][i]) ver++;
            else ver = 0;

            if (ver == 3) count++;
        }
    }
    do {
        if ((ix > 0 && iy > 0)) {
            if (mat[ix][iy] == mat[ix - 1][iy - 1]) {
                iy++;
            }
        }
        x = ix;
        y = iy;
        rep++;

        while ((mat[x][y] == mat[x + 1][y + 1])) {
            rep++;
            x++;
            y++;
            if (rep == 4) {
                count++;
            }
            if (x == size - 1 || y == size - 1) break;
        }
        rep = 0;
        if (iy + 3 >= size) {
            ix++;
            iy = 0;
        } else {
            iy++;
        }
    } while (ix < size - 1);
    return count > 1;
}