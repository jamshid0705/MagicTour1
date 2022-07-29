
    class FeatureApi{
      constructor(TourQuery,AnswerQuery){
        this.TourQuery=TourQuery;
        this.AnswerQuery=AnswerQuery;
        // return this
      }
      filter(){
        // filter
    
        const tourQuery={...this.TourQuery};
        const tourRep=JSON.stringify(tourQuery).replace(/\bgte\b/g,'$gte').replace(/\bgt\b/g,'$gt').replace(/\blt\b/g,'$lt').replace(/\blte\b/g,'$lte')
        this.AnswerQuery=this.AnswerQuery.find(JSON.parse(tourRep))
        return this
      }
      sort(){
        // sort
        if(this.TourQuery.sort){
          console.log(this.TourQuery.sort)
          let sortTourArr=this.TourQuery.sort.split(',').join(" ")
          this.AnswerQuery=this.AnswerQuery.sort(sortTourArr)
       }
       return this

      }
      field(){
         // field
        if(this.TourQuery.field){
          let feildTour=this.TourQuery.field.split(',').join(' ')
          this.AnswerQuery=this.AnswerQuery.select(feildTour)
        }
        return this
      }
      pagenation(){
        // pagenation
        if(this.TourQuery.page){
          const page=this.TourQuery.page*1
          const limit=this.TourQuery.limit*1
          this.AnswerQuery=this.AnswerQuery.skip((page-1)*limit).limit(limit)
        }
        return this
      }
    }

    module.exports=FeatureApi