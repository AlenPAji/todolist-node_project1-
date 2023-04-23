
$('.inputwork').click(function(){
  $('#btblk').prop('disabled', false);
  console.log("unblocked");

})


$('#btblk').click(function(){
  if($('.inputwork').val()==''){
      $('#btblk').prop('disabled', true);
      console.log("blocked");
  }
  else{
      $('#btblk').prop('disabled', false);
  }

})
