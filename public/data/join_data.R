# Join data to dictionary
library(dplyr)
data <- read.csv('winter.csv', stringsAsFactors = FALSE) %>% 
        rename(Code=Country)
dict <- read.csv('dictionary.csv', stringsAsFactors = FALSE)
all_data <- data %>% left_join(dict, by="Code") %>% filter(!is.na(Country))
write.csv(all_data, 'all_data.csv', row.names = FALSE)
