ReadMe.md


##### Data Spider:

Spider result -> ./data/myOutput.csv
If you want whole required information, please uncomment mongodb related code in v9.parser.js, after running v9.js for some time (Until you get enough community records. The longer you run, the more community records you will get.) Then you need to run v9_mongo_add_detail.js individually to add all detail information (i.e house count and buildings count) related to all records stored in mongodb. After that, you need to export whole .csv file in terminal like this:

> mongoexport --db community --collection communities --out communicates.json

or if you need csv file

> mongoexport --host localhost --db community --collection communities --csv --out communities_test.csv --fields community_id,mean_price,community_age,community_name,lng,lat,total_buildings,total_houses

Total Data Spider Stage Result Example -> communities.json or communities_test.csv


##### Data Analyze:

All data used is in ./data folder. Note, myOutput.csv is one of my running spider's result.
And communities_test.csv is the same as one of spider stage's final output.

HW_Kmeans_Community.r -> Use kmeans to find best k and draw graph using ggplot2 according to communities' latitude and lantitude.
HW_linear_reg_housing_price_prediction.r -> Use multivariant linear regression to predict given two communities' price.

For result plots, please refer to two .png files in this folder. Note there is final ggplot need to be scaled to see. If you want to see it, you need to run the whole HW_Kmeans_Community.r.


##### Data Visulization:

Just open it and test -> HW_House_Price_Visulization.html
Take care to use only Chrome and it is better to first

install a server:
> npm install http-server -g
Then up a server:
> http-server &

on the folder you put these files in.






