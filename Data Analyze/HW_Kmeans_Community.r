library(fpc)
library(ggplot2)

mydata <- read.table("./dataset/myOutput.csv", header=FALSE,  sep=",")
mydata <- mydata[, 1:3]
head(mydata)

min.max.norm <- function(x){
  (x-min(x))/(max(x)-min(x))
}
raw.data <- mydata
norm.data <- data.frame(lat = min.max.norm(as.numeric(as.character(raw.data[,2]))),
                        lng = min.max.norm(as.numeric(as.character(raw.data[,3]))))
unnorm.data <- data.frame(lat = as.numeric(as.character(raw.data[,2])),
                          lng = as.numeric(as.character(raw.data[,3])))
head(norm.data)
head(unnorm.data)

K <- 2:8
round <- 100

# Silhouette Coefficient
rst <- sapply(K, function(i) {
  print(paste("K=", i))
  mean(sapply(1:round,function(r) {
    print(paste("Round", r))
    result <- kmeans(norm.data, i)
    stats <- cluster.stats(dist(norm.data), result$cluster)
    stats$avg.silwidth # This is the return value - Silhouette Coefficient!
  }))
})
plot(K,rst,type='l',main='Silhouette Coefficient vs K', ylab='Silhouette Coefficient')

# k = 2
# clu <- kmeans(norm.data,k)
# mds = cmdscale(dist(norm.data,method="euclidean"))
# plot(mds, col=clu$cluster, main='kmeans - k=2', pch = 19)

# ggplot2 display kmeans result
df <- norm.data
# df <- unnorm.data
m <- as.matrix(df)
head(m)

cl <- kmeans(m,5)
cl$size
cl$withinss

df$cluster=factor(cl$cluster)
centers=as.data.frame(cl$centers)

head(df)

ggplot(data=df, aes(x=lat, y=lng, color=cluster )) + geom_point()

last_plot() + 
  geom_point(data=centers, aes(x=lat,y=lng, color='Center')) +
  geom_point(data=centers, aes(x=lat,y=lng, color='Center'), size=100, alpha=.2)
