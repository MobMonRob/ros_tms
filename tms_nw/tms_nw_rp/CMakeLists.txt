cmake_minimum_required(VERSION 2.8.3)
project(tms_nw_rp)

find_package(catkin REQUIRED COMPONENTS
  rospy
  std_msgs
  message_generation
)

#add_message_files(
#  FILES
#)

add_service_files(
  FILES
  tms_nw_req.srv
)

generate_messages(
  DEPENDENCIES
  std_msgs
)

catkin_package(
#  INCLUDE_DIRS include
   LIBRARIES tms_nw_rp
   CATKIN_DEPENDS rospy std_msgs message_generation
#  DEPENDS system_lib
)
