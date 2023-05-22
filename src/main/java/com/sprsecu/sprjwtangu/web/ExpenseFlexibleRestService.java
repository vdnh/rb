package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ExpenseFlexibleRepository;
import com.sprsecu.sprjwtangu.entities.ExpenseFlexible;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author vdnh
 * © Nhat Hung VO DINH
 */
@RestController
@CrossOrigin("*")
public class ExpenseFlexibleRestService {
    @Autowired
    private ExpenseFlexibleRepository expenseFlexibleRepository;

    @RequestMapping(value = "/expenseFlexibleOfOwner", method = RequestMethod.GET)
    public List<ExpenseFlexible> expenseFlexibleOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return expenseFlexibleRepository.expenseFlexiblesOwner(idOwner);
    }    

    @RequestMapping(value = "/expenseFlexible/{id}", method = RequestMethod.GET)
    public ExpenseFlexible getExpenseFlexible(@PathVariable Long id){
        return expenseFlexibleRepository.findById(id).get();
    }

    @RequestMapping(value = "/expenseFlexible", method = RequestMethod.POST)
    public ExpenseFlexible save(@RequestBody ExpenseFlexible e){
        return expenseFlexibleRepository.save(e);
    }

    @RequestMapping(value = "/expenseFlexible/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        expenseFlexibleRepository.deleteById(id);
        return true;
    }

    @RequestMapping(value = "/expenseFlexible", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        expenseFlexibleRepository.deleteById(id);
        return true;
    }

    @RequestMapping(value = "/expenseFlexible/{id}", method = RequestMethod.PUT)
    public ExpenseFlexible updateExpenseFlexible(@PathVariable Long id, @RequestBody ExpenseFlexible e){
        e.setId(id);
        return expenseFlexibleRepository.save(e);
    }        
}