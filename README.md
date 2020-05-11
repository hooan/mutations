# mutations

## Servicios 

  ### /mutation/
        + curl -d '{"dna":["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTT"]}' -H "Content-Type: application/json" -X POST  https://mutation-app-cristobal.herokuapp.com/mutation/ 
  ### /stats/
        + curl  -H "Content-Type: application/json" -X GET https://mutation-app-cristobal.herokuapp.com/stats 
