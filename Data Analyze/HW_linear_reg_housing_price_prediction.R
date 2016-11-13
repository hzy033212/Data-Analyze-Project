# read data
data_SH<-read.csv("./dataset/communities_test.csv")
data_SH <- data_SH[,c(2,3,5,6,7,8)]
head(data_SH)
n = nrow(data_SH) # 318
names(data_SH)

# decompose training dataset and test dataset
train_ds<-data_SH[1:200,]
test_ds<-data_SH[201:318,]
attach(train_ds)

# plot the data with five factors to be considered
plot(community_age,mean_price)
plot(lng,mean_price)
plot(lat,mean_price)
plot(total_buildings,mean_price)
plot(total_houses,mean_price)

## 1. plot raw data with log mean_price
y1 <- log(mean_price)  
plot(community_age,y1)
plot(lng,y1)
plot(lat,y1)
plot(total_buildings,y1)
plot(total_houses,y1)

## 2. Run Linear Regression
reg=lm(mean_price ~ community_age + lng + lat + total_buildings + total_houses)
summary(reg)

## 3. Model Interpret

# intercept
a1 = coefficients(reg)[1]
# slope
b1 = coefficients(reg)[2]
c1 = coefficients(reg)[3]
d1 = coefficients(reg)[4]
e1 = coefficients(reg)[5]
f1 = coefficients(reg)[6]
# Linear model formula
y = a1 + b1 * community_age + c1 * lng + d1 * lat + e1 * total_buildings + f1 * total_houses

## 4. Prediction

# First given test case
test1 = array(6)
test1[1] = 1
test1[2] = 15
test1[3] = 121.4
test1[4] = 31.2
test1[5] = 10
test1[6] = 240
# Second given test case
test2 = array(6)
test2[1] = 1
test2[2] = 5
test2[3] = 121.5
test2[4] = 31.25
test2[5] = 10
test2[6] = 800
predictOne = test1 %*% coefficients(reg)
predictTwo = test2 %*% coefficients(reg)
cat("Independent variables of both first and second test cases refer to previous test1 and test2 array.")
cat("Predict community mean price for first test case is: ", predictOne)
cat("Predict community mean price for second test case is: ", predictTwo)

## 5. Model accurancy

predictPrice <- function(list) {
  return (list %*% coefficients(reg)[c(2,3,4,5,6)])
}
# Calculate and show mean error
test_data = test_ds[,c(2,3,4,5,6)]
totalError = 0
for (i in range(1, 118)) {
  predict = predictPrice(as.matrix(test_data[i,]))
  totalError = totalError + (6139477 + test_ds$mean_price[i] - predict)/test_ds$mean_price[i]
}
meanError = totalError / 118
cat("Model accuracy on assigned test data is: ", abs(meanError))