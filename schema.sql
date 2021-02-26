DROP TABLE explorer_table;
CREATE TABLE explorer_table (
  id SERIAL PRIMARY KEY, 
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7)

)

-- function Location(fileData, cityName) {
--   this.search_query = cityName;
--   this.formatted_query = fileData[0].display_name;
--   this.latitude = fileData[0].lat;
--   this.longitude = fileData[0].lon;
-- }